import { TOOLS_CONFIG } from '../src/data/toolsConfig';
import { blogService } from '../src/services/blogService';

console.log('=== AUDITORÍA DE TÍTULOS EN TOOLS_CONFIG ===');
let toolOverCount = 0;
let totalTools = 0;

for (const [key, tool] of Object.entries(TOOLS_CONFIG)) {
  totalTools++;
  const title = tool.title || '';
  const seoTitle = tool.seo?.title || '';
  
  if (title.length > 60) {
    toolOverCount++;
    console.log(`[Tool title > 60] ${key} (${title.length} chars): "${title}"`);
  }
  if (seoTitle.length > 60) {
    toolOverCount++;
    console.log(`[Tool seo.title > 60] ${key} (${seoTitle.length} chars): "${seoTitle}"`);
  }
}

console.log('\n=== AUDITORÍA DE TÍTULOS EN BLOG_POSTS ===');
let blogOverCount = 0;
const posts = blogService.getAllPosts();
for (const post of posts) {
  const title = post.title || '';
  const seoTitle = post.seoTitle || '';
  if (title.length > 60) {
    blogOverCount++;
    console.log(`[Blog Title > 60] ${post.slug} (${title.length} chars): "${title}"`);
  }
  if (seoTitle.length > 60) {
    blogOverCount++;
    console.log(`[Blog seoTitle > 60] ${post.slug} (${seoTitle.length} chars): "${seoTitle}"`);
  }
}

console.log(`\nResumen: ${toolOverCount} títulos de herramientas > 60 chars (de ${totalTools} herramientas), ${blogOverCount} títulos de blog > 60 chars (de ${posts.length} posts).`);
