export const createQuery = ({ url, method, body, params }) => ({
  query: () => ({
    url,
    method,
    body,
    params,
  }),
});

// apiUtils.js
export const createGetQuery = url => createQuery({ url, method: 'GET' });

export const createPostQuery = (url, body) => createQuery({ url, method: 'POST', body });

export const createPatchQuery = (url, body) => createQuery({ url, method: 'PATCH', body });

export const createDeleteQuery = url => createQuery({ url, method: 'DELETE' });
