FROM node:22-bullseye

# Set working directory inside the container
WORKDIR /app

# Use a consistent npm version for lockfile compatibility
RUN npm i -g npm@10

# Install build tools for native modules (if present).  Some
# dependencies – especially optional peer dependencies – may need
# compilation and thus require these packages.  Removing apt lists
# afterwards reduces image size.
RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 make g++ \
  && rm -rf /var/lib/apt/lists/*

# Relax peer-dependency resolution and disable funding/audit prompts
ENV npm_config_legacy_peer_deps=true
ENV npm_config_fund=false
ENV npm_config_audit=false

# Copy package manifests first to leverage Docker layer caching
COPY package*.json ./

# Install dependencies.  If a lockfile exists use `npm ci` for
# deterministic installs; otherwise fallback to `npm install`.  A
# secondary attempt with `--force` mitigates transient network or
# integrity failures.
RUN if [ -f package-lock.json ]; then \
      npm ci || npm ci --force; \
    else \
      npm install || npm install --force; \
    fi

# Copy the rest of the source code into the image
COPY . .

# Expose the port Vite will run on.  We'll explicitly set the port
# when running the dev server below.
EXPOSE 3000

# Default command starts the Vite development server on port 3000 and
# binds to all interfaces.  Users can override this with `npm run
# build` in a derived stage to produce a production build.
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "3000"]