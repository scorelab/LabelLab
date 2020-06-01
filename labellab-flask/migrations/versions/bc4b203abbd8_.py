"""empty message

Revision ID: bc4b203abbd8
Revises: 31d3e32516c0
Create Date: 2020-06-01 15:25:04.482783

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'bc4b203abbd8'
down_revision = '31d3e32516c0'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('revoked_token',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('jti', sa.String(length=120), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('labels',
    sa.Column('label_id', sa.Integer(), nullable=False),
    sa.Column('image_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['image_id'], ['image.id'], ),
    sa.ForeignKeyConstraint(['label_id'], ['label.id'], ),
    sa.PrimaryKeyConstraint('label_id', 'image_id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('labels')
    op.drop_table('revoked_token')
    # ### end Alembic commands ###
