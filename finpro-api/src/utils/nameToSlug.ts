const nameToSlug = (name: string) => {
  return name.trim().toLowerCase().replace(/\s/g, "-");
};

export default nameToSlug;