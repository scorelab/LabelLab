import os
from subprocess import call
import coverage
import sys
import click


COV = None
if os.environ.get("FLASK_COVERAGE"):
    COV = coverage.coverage(branch=True, include="./*")
    COV.start()

@click.command()
@click.option(
    "--coverage/--no-coverage",
    default=False,
    help="Run tests under code coverage.",
)
def test(coverage):
    """Run the unit tests."""
    if coverage and not os.environ.get("FLASK_COVERAGE"):
        import subprocess

        os.environ["FLASK_COVERAGE"] = "1"
        sys.exit(subprocess.call(sys.argv))
    import unittest

    tests = unittest.TestLoader().discover("tests")
    result = unittest.TextTestRunner(verbosity=2).run(tests)

    if COV:
        COV.stop()
        COV.save()
        print("Coverage Summary:")
        COV.report()
        basedir = os.path.abspath(os.path.dirname(__file__))
        covdir = os.path.join(basedir, "tmp/coverage")
        COV.html_report(directory=covdir)
        print("HTML version: file://%s/index.html" % covdir)
        COV.erase()

    if result.wasSuccessful():
        return 0
    else:
        sys.exit("Tests have failed")