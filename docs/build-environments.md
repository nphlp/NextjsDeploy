# Build Environments

Il y a plusieurs façons de builder et lancer l'application Next.js.

## Build `terminal`

Sur la machine locale
-> directement dans le terminal

```bash
pnpm build
```

## Build `basic`

Sur la machine locale
-> dans un compose `nextjs` standalone

```bash
make basic
```

## Build `local`

Sur la machine locale
-> dans un compose `nextjs` standalone
-> piloté par un compose `portainer + traefik` standalone

```bash
make local
```

## Build `vps`

Sur le VPS
-> dans un compose `nextjs` standalone
-> piloté par un compose `portainer + traefik` standalone

```bash
make vps
```
