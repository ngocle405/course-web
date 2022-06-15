FROM nginx:stable
COPY nginx.conf /etc/nginx/nginx.conf
COPY dist/bpm-web /usr/share/nginx/html
