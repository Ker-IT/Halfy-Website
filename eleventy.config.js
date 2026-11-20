export default function (eleventyConfig) {
  // Passthrough copy for existing brand assets and custom CSS/JS
  eleventyConfig.addPassthroughCopy({
    "assets": "assets",
    "src/assets": "assets",
    "CNAME": "CNAME",
  });

  // Watch shared assets for changes during local dev
  eleventyConfig.addWatchTarget("src/assets/");

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
    templateFormats: ["njk", "html", "md"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
}
