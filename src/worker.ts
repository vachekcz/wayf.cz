export default {
  fetch(request, env) {
    const url = new URL(request.url);
    if (url.hostname === 'www.wayf.cz') {
      url.protocol = 'https:';
      url.hostname = 'wayf.cz';
      url.port = '';
      return Response.redirect(url.href, 301);
    }

    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
