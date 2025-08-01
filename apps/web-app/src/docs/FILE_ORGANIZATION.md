# Foundly App - File Organization

This document outlines the organization of project files, particularly for SQL schemas and documentation.

## Directory Structure

### Database Files
- **Location**: `src/database/`
- **Purpose**: Contains all SQL schema files, migrations, and database-related scripts
- **Files**:
  - `user_profiles.sql` - Complete database schema including user profiles, organizations, join requests, and organization members

### Documentation Files
- **Location**: `src/docs/`
- **Purpose**: Contains all project documentation, implementation guides, and technical specifications
- **Files**:
  - `CLERK_SUPABASE_INTEGRATION.md` - Documentation for Clerk + Supabase authentication integration
  - `ORGANIZATION_FLOW_IMPLEMENTATION.md` - Documentation for organization join/create flow implementation

## Guidelines

### For SQL Files
- All SQL files should be placed in `src/database/`
- Use descriptive names that indicate the purpose or feature
- Include comprehensive comments explaining table relationships and policies

### For Documentation Files  
- All documentation should be placed in `src/docs/`
- Use descriptive filenames in UPPERCASE with underscores
- Include implementation details, usage examples, and next steps

## Migration Notes

Files have been moved from the root directory to their proper locations:
- `database/user_profiles.sql` → `src/database/user_profiles.sql`
- `CLERK_SUPABASE_INTEGRATION.md` → `src/docs/CLERK_SUPABASE_INTEGRATION.md`
- `ORGANIZATION_FLOW_IMPLEMENTATION.md` → `src/docs/ORGANIZATION_FLOW_IMPLEMENTATION.md`

All references in code and documentation have been updated to reflect the new file paths.
