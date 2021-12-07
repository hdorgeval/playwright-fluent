FROM mcr.microsoft.com/playwright:focal

WORKDIR PlaywrightFluent

COPY package.json /PlaywrightFluent

RUN npm install
RUN npx playwright install chrome msedge --with-deps

COPY jest.config.js /PlaywrightFluent
COPY tsconfig.json /PlaywrightFluent
COPY src /PlaywrightFluent/src
COPY images /PlaywrightFluent/images
COPY coverage /PlaywrightFluent/coverage

ENTRYPOINT ["npm"]
