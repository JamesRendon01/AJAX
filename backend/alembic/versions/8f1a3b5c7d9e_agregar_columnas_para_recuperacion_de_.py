"""agregar columnas para recuperacion de contrasena

Revision ID: 8f1a3b5c7d9e
Revises: 9e8088b4746f
Create Date: 2026-06-11 14:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '8f1a3b5c7d9e'
down_revision: Union[str, Sequence[str], None] = '9e8088b4746f'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('entrenadores', sa.Column('email', sa.String(), nullable=True))
    op.add_column('entrenadores', sa.Column('reset_token', sa.String(), nullable=True))
    op.add_column('entrenadores', sa.Column('reset_token_expiry', sa.DateTime(), nullable=True))


def downgrade() -> None:
    op.drop_column('entrenadores', 'reset_token_expiry')
    op.drop_column('entrenadores', 'reset_token')
    op.drop_column('entrenadores', 'email')
