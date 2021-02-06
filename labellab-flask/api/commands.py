import os
from subprocess import call
import coverage
import sys
import click
from flask import current_app
from flask.cli import with_appcontext
from flask_migrate import upgrade
from werkzeug.exceptions import MethodNotAllowed, NotFound


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

@click.command()
def clean():
    """Remove *.pyc and *.pyo files recursively starting at current directory.
    Borrowed from Flask-Script, converted to use Click.
    """
    for dirpath, _, filenames in os.walk("."):
        for filename in filenames:
            if filename.endswith(".pyc") or filename.endswith(".pyo"):
                full_pathname = os.path.join(dirpath, filename)
                click.echo("Removing {}".format(full_pathname))
                os.remove(full_pathname)


@click.command()
@click.option(
    "--url", default=None, help="Url to test (ex. /static/image.png)"
)
@click.option(
    "--order",
    default="rule",
    help="Property on Rule to order by (default: rule)",
)
@with_appcontext
def urls(url, order):
    """Display all of the url matching routes for the project.
    Borrowed from Flask-Script, converted to use Click.
    """
    rows = []
    column_headers = ("Rule", "Endpoint", "Arguments")

    if url:
        try:
            rule, arguments = current_app.url_map.bind("localhost").match(
                url, return_rule=True
            )
            rows.append((rule.rule, rule.endpoint, arguments))
            column_length = 3
        except (NotFound, MethodNotAllowed) as e:
            rows.append(("<{}>".format(e), None, None))
            column_length = 1
    else:
        rules = sorted(
            current_app.url_map.iter_rules(),
            key=lambda rule: getattr(rule, order),
        )
        for rule in rules:
            rows.append((rule.rule, rule.endpoint, None))
        column_length = 2

    str_template = ""
    table_width = 0

    if column_length >= 1:
        max_rule_length = max(len(r[0]) for r in rows)
        max_rule_length = max_rule_length if max_rule_length > 4 else 4
        str_template += "{:" + str(max_rule_length) + "}"
        table_width += max_rule_length

    if column_length >= 2:
        max_endpoint_length = max(len(str(r[1])) for r in rows)
        max_endpoint_length = (
            max_endpoint_length if max_endpoint_length > 8 else 8
        )
        str_template += "  {:" + str(max_endpoint_length) + "}"
        table_width += 2 + max_endpoint_length

    if column_length >= 3:
        max_arguments_length = max(len(str(r[2])) for r in rows)
        max_arguments_length = (
            max_arguments_length if max_arguments_length > 9 else 9
        )
        str_template += "  {:" + str(max_arguments_length) + "}"
        table_width += 2 + max_arguments_length

    click.echo(str_template.format(*column_headers[:column_length]))
    click.echo("-" * table_width)

    for row in rows:
        click.echo(str_template.format(*row[:column_length]))


@click.command()
def deploy():
    """
    migrate database to latest revision
    """
    upgrade()
