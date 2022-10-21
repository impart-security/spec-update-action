
# Specification update action

This action updates a specification for a given organization.

## Inputs

### `access_token`

**Required** An access token with both `write:org_specs` and `read:org_specs` permissions.

### `org_id`

**Required** The ID of the organization.

### `spec_id`

**Required** The ID of the specification.

### `path`

**Required** The path to the spec file.

### `name`

**Optional** The name of the specification. Defaults to the current specification name.

### `hostname`

**Optional** The hostname of the API.

## Example usage

```yaml
uses: ./.github/actions/spec-update-action
with:
  access_token: {{ secrets.ACCESS_TOKEN }}
  org_id: "c3172c84-bba2-4431-b3b6-edcaf5153417"
  spec_id: "7ed3f413-e25e-4e7f-8c90-f409bf1b18cd"
  path: "./spec.yaml"
```
