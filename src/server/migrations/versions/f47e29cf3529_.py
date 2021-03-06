"""empty message

Revision ID: f47e29cf3529
Revises: 46270938ab2a
Create Date: 2020-07-27 15:34:03.029300

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision = 'f47e29cf3529'
down_revision = '46270938ab2a'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('bookings',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('created_at', sa.DateTime(timezone=True), nullable=True),
    sa.Column('hotel_id', sa.String(length=70), nullable=False),
    sa.Column('checkin_dt', sa.DateTime(timezone=True), nullable=True),
    sa.Column('checkout_dt', sa.DateTime(timezone=True), nullable=True),
    sa.Column('status', sa.String(length=70), nullable=False),
    sa.ForeignKeyConstraint(['hotel_id'], ['hotels.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.alter_column(u'users', 'created_at',
               existing_type=mysql.DATETIME(),
               nullable=True)
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column(u'users', 'created_at',
               existing_type=mysql.DATETIME(),
               nullable=False)
    op.drop_table('bookings')
    # ### end Alembic commands ###
