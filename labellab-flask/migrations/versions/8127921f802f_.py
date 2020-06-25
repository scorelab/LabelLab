"""empty message

Revision ID: 8127921f802f
Revises: efd753d43546
Create Date: 2020-06-12 23:57:52.330241

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '8127921f802f'
down_revision = 'efd753d43546'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('model_has_label',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('model_id', sa.Integer(), nullable=True),
    sa.Column('label_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['label_id'], ['label.id'], ),
    sa.ForeignKeyConstraint(['model_id'], ['model.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('model_has_label')
    # ### end Alembic commands ###