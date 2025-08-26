export const fetchContent = async (repo: string, path: string) => {
  const url = `https://raw.githubusercontent.com/navikt/${repo}/${path}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(
      `Failed to fetch content from ${url} (status ${response.status})`
    );
  }
  const text = await response.text();
  console.log(
    `Fetched content from ${url}: ${response.status} (len=${text.length})`
  );
  return text;
};
