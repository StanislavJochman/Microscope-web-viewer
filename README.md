# Desktop application for showing image from microscope camera

This is a compact application designed to connect to a microscope camera, offering the ability to flip the captured video in real-time. Additionally, it allows users to capture and save images, as well as convert the video feed to grayscale for enhanced visual analysis.

## Running the application

```bash
docker run -d -p 3000:3000 stanislavjochman/microscope-camera
```

## Custom docker-compose.yml

```dockerfile
---
services:
  webserver:
    image: stanislavjochman/microscope-camera
    restart: unless-stopped
    ports:
      - "80:3000"
```
