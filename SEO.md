# SEO Audit

Audit of all pages: `metadata.title`, `metadata.description`, and `<h1>` presence.

## Summary

| Metric               | Count |
| -------------------- | ----- |
| Total pages          | 22    |
| metadata.title       | 22/22 |
| metadata.description | 22/22 |
| h1                   | 22/22 |

## Pages

### Public

| Route           | title | description | h1  | Notes                          |
| --------------- | ----- | ----------- | --- | ------------------------------ |
| `/`             | ✅    | ✅          | ✅  |                                |
| `/fruits`       | ✅    | ✅          | ✅  |                                |
| `/fruit/[id]`   | ✅    | ✅          | ✅  | Dynamic via `generateMetadata` |
| `/fruit/create` | ✅    | ✅          | ✅  |                                |
| `/baskets`      | ✅    | ✅          | ✅  |                                |

### Auth

| Route                     | title | description | h1  | Notes |
| ------------------------- | ----- | ----------- | --- | ----- |
| `/login`                  | ✅    | ✅          | ✅  |       |
| `/login/success`          | ✅    | ✅          | ✅  |       |
| `/register`               | ✅    | ✅          | ✅  |       |
| `/register/success`       | ✅    | ✅          | ✅  |       |
| `/reset-password`         | ✅    | ✅          | ✅  |       |
| `/reset-password/success` | ✅    | ✅          | ✅  |       |
| `/verify-2fa`             | ✅    | ✅          | ✅  |       |
| `/profile`                | ✅    | ✅          | ✅  |       |

### Dev

| Route              | title | description | h1  | Notes                      |
| ------------------ | ----- | ----------- | --- | -------------------------- |
| `/dev`             | ✅    | ✅          | ✅  |                            |
| `/dev/colors`      | ✅    | ✅          | ✅  |                            |
| `/dev/components`  | ✅    | ✅          | ✅  |                            |
| `/dev/dialogs`     | ✅    | ✅          | ✅  |                            |
| `/dev/form`        | ✅    | ✅          | ✅  |                            |
| `/dev/layout-demo` | ✅    | ✅          | ✅  |                            |
| `/dev/scalar`      | ✅    | ✅          | ✅  | `sr-only` (external embed) |
| `/dev/skeleton`    | ✅    | ✅          | ✅  |                            |
| `/dev/ui`          | ✅    | ✅          | ✅  |                            |

## Status

All pages pass the SEO audit: metadata title + description + h1.
