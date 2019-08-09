FROM gradle:5.5.1-jdk8 as builder

# Set the working directory to /app
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

RUN gradle distZip
RUN mkdir /dist
RUN unzip gluecan-backend/build/distributions/gluecan.zip -d /dist

FROM anapsix/alpine-java:8_jdk
COPY --from=builder /dist /app

EXPOSE 8080

CMD ["/app/gluecan/bin/gluecan"]
