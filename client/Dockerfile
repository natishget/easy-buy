FROM node:20-alpine

# create a non-root user
RUN addgroup -S app && adduser -S -G app app

WORKDIR /app

# copy only package files first for layer caching
COPY package*.json ./

# install pnpm (run as root) and deps
RUN npm install -g pnpm@latest

# copy rest of project files
COPY . .

# ensure the app user owns the workspace (do this after final copy)
RUN chown -R app:app /app

# create .next dir and give ownership (defensive)
RUN mkdir -p /app/.next && chown -R app:app /app/.next

# switch to non-root user
USER app

# install dependencies
RUN pnpm install

EXPOSE 3000

CMD ["pnpm", "run", "dev"]