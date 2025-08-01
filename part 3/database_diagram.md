# Database Schema Diagram

## HBnB Database Architecture

This document describes the database schema for the HBnB (Holberton AirBnB) application using SQLAlchemy ORM.

### Entity Relationship Diagram

```
┌─────────────────┐         ┌─────────────────┐
│      User       │         │    Amenity      │
├─────────────────┤         ├─────────────────┤
│ id (PK)         │         │ id (PK)         │
│ email           │         │ name            │
│ first_name      │         │ created_at      │
│ last_name       │         │ updated_at      │
│ password        │         └─────────────────┘
│ is_admin        │                   ▲
│ created_at      │                   │
│ updated_at      │                   │ M:M
└─────────────────┘                   │
         │                            │
         │ 1:M                        │
         ▼                            ▼
┌─────────────────┐         ┌─────────────────┐
│     Place       │◄────────┤ place_amenity   │
├─────────────────┤         │ (Association)   │
│ id (PK)         │         ├─────────────────┤
│ title           │         │ place_id (FK)   │
│ description     │         │ amenity_id (FK) │
│ price           │         └─────────────────┘
│ latitude        │
│ longitude       │
│ owner_id (FK)   │
│ created_at      │
│ updated_at      │
└─────────────────┘
         │
         │ 1:M
         ▼
┌─────────────────┐
│     Review      │
├─────────────────┤
│ id (PK)         │
│ text            │
│ rating          │
│ user_id (FK)    │
│ place_id (FK)   │
│ created_at      │
│ updated_at      │
└─────────────────┘
```

### Tables Description

#### users
- **Primary Key**: id (UUID)
- **Unique Constraints**: email
- **Relationships**: 
  - One-to-many with places (as owner)
  - One-to-many with reviews

#### places
- **Primary Key**: id (UUID)
- **Foreign Keys**: owner_id → users.id
- **Relationships**:
  - Many-to-one with users (owner)
  - One-to-many with reviews
  - Many-to-many with amenities

#### reviews
- **Primary Key**: id (UUID)
- **Foreign Keys**: 
  - user_id → users.id
  - place_id → places.id
- **Constraints**: rating BETWEEN 1 AND 5

#### amenities
- **Primary Key**: id (UUID)
- **Relationships**: Many-to-many with places

#### place_amenity (Association Table)
- **Composite Primary Key**: (place_id, amenity_id)
- **Foreign Keys**:
  - place_id → places.id
  - amenity_id → amenities.id

### Key Features

1. **UUID Primary Keys**: All entities use UUID for better distribution and security
2. **Timestamps**: All entities have created_at and updated_at timestamps
3. **Soft Relationships**: SQLAlchemy manages relationships with proper foreign keys
4. **Cascade Operations**: Deleting a user/place will cascade to related entities
5. **Validation**: Price, latitude, longitude, and rating have validation constraints
6. **Password Security**: Passwords are hashed using bcrypt

### Database Configuration

- **Development**: SQLite database (`instance/hbnb_dev.db`)
- **Production**: Configurable via environment variables
- **ORM**: SQLAlchemy with Flask-SQLAlchemy extension
- **Migrations**: Automatic table creation on app startup
