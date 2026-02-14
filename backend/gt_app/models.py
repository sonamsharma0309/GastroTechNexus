# backend/app/models.py
from datetime import datetime
from .utils.db import db

class FlavorProperty(db.Model):
    __tablename__ = "flavor_properties"

    id = db.Column(db.Integer, primary_key=True)
    # FlavorDB IDs
    flavordb_id = db.Column(db.String(64), unique=True, index=True)   # "_id" from API
    pubchem_id = db.Column(db.Integer, index=True)

    # Important fields (tum baad me add kar sakti ho)
    molecular_formula = db.Column(db.String(64))
    energy = db.Column(db.Float)
    alogp = db.Column(db.Float)
    num_rings = db.Column(db.Integer)

    raw_json = db.Column(db.Text)   # full raw JSON store (optional but useful)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "flavordb_id": self.flavordb_id,
            "pubchem_id": self.pubchem_id,
            "molecular_formula": self.molecular_formula,
            "energy": self.energy,
            "alogp": self.alogp,
            "num_rings": self.num_rings,
            "created_at": self.created_at.isoformat(),
        }
