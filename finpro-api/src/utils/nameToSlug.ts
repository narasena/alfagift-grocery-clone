export default function nameToSlug (name: string) {
  return name.toLowerCase().replace(/\s+/g, "-");
}