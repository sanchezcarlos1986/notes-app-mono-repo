const notFound = (request, response) => {
  response.status(404).json({
    error: 'Not found...'
  })
}

export default notFound
