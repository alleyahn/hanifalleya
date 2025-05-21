module.exports = function(eleventyConfig) {
  // Copy the assets directory to the output
  eleventyConfig.addPassthroughCopy("src/assets");
  
  // Default date formatting
  eleventyConfig.addFilter("dateFormat", function(date) {
    return new Date(date).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  });
  
  // ISO date format for datetime attributes
  eleventyConfig.addFilter("dateIso", function(date) {
    return new Date(date).toISOString().split('T')[0];
  });
  
  // Add JSON filter for JavaScript data
  eleventyConfig.addFilter("json", function(value) {
    return JSON.stringify(value);
  });

  // Add striptags filter to remove HTML from content
  eleventyConfig.addFilter("striptags", function(value) {
    return value ? String(value).replace(/<[^>]*>/g, '') : '';
  });
  
  // Add slug filter
  eleventyConfig.addFilter("slug", function(value) {
    return value
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  });
  
  // Blog collection
  eleventyConfig.addCollection("blog", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/blog/*.md");
  });
  
  // Get most recent blog posts
  eleventyConfig.addCollection("latestPosts", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/blog/*.md")
      .sort((a, b) => b.date - a.date)
      .slice(0, 3);
  });

  // Gallery collection
  eleventyConfig.addCollection("gallery", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/gallery/*.md");
  });

  // Get featured or latest gallery image for homepage
  eleventyConfig.addCollection("featuredImage", function(collectionApi) {
    // First try to find any image marked as featured
    const featured = collectionApi.getFilteredByGlob("src/gallery/*.md")
      .filter(item => item.data.featured);
      
    if (featured.length > 0) {
      return [featured[0]]; // Return the first featured image
    } else {
      // If no featured images, return the most recent
      return collectionApi.getFilteredByGlob("src/gallery/*.md")
        .sort((a, b) => b.date - a.date)
        .slice(0, 1);
    }
  });

  // Get all unique tags
  eleventyConfig.addCollection("tagList", function(collectionApi) {
    const tagsSet = new Set();
    collectionApi.getAll().forEach(item => {
      if (!item.data.tags) return;
      item.data.tags.forEach(tag => tagsSet.add(tag));
    });
    return Array.from(tagsSet).sort();
  });

  // Get all content with a specific tag
  eleventyConfig.addCollection("taggedItems", function(collectionApi) {
    const taggedItems = {};
    
    collectionApi.getAll().forEach(item => {
      if (!item.data.tags) return;
      
      item.data.tags.forEach(tag => {
        if (!taggedItems[tag]) {
          taggedItems[tag] = [];
        }
        taggedItems[tag].push(item);
      });
    });
    
    // Sort each tag's items by date
    for (const tag in taggedItems) {
      taggedItems[tag].sort((a, b) => b.date - a.date);
    }
    
    return taggedItems;
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes"
    },
    templateFormats: ["njk", "md", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk"
  };
};