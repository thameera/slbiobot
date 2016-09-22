# Sri Lankan Bio Bot

Sniffing around Sri Lankan tweeps' bios like a boss

## Running the website locally with nginx

```sh
docker pull nginx
docker run --name biobot -v $PWD/nginx-sample.conf:/etc/nginx/nginx.conf:ro -v $PWD/web:/src -p 8080:80 -d nginx
```

Now visit http://localhost:8080 in the browser.
