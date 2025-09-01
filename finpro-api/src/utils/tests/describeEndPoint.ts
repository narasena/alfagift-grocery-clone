const describeEndPoint = (
  method: "GET" | "POST" | "PUT" | "DELETE",
  path: string,
) => {
  return `${method} ${path}`
}

export default describeEndPoint