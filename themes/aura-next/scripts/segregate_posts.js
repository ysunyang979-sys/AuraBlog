/**
 * Comprehensive Content Segregation & Pagination Fix
 * --------------------------------------------------
 * This script ensures password-protected posts are entirely removed from the
 * default 'posts' collection used by ALL generators (Index, Archive, etc.).
 * This fixes the 'empty slots' or 'gap' issue in pagination, ensuring every
 * page has exactly 9 public posts if they exist in the library.
 */

hexo.extend.filter.register('before_generate', function() {
    const posts = this.model('Post');
    const pages = this.model('Page');

    // 1. Capture ALL items that have a password
    const lockedPosts = posts.find({password: {$exists: true}}).toArray();
    const lockedPages = pages.find({password: {$exists: true}}).toArray();
    const allLocked = lockedPosts.concat(lockedPages).sort((a, b) => (b.date || 0) - (a.date || 0));

    // 2. Set the custom 'locked_items' local for the /locked page
    this.locals.set('locked_items', () => allLocked);

    // 3. SECURE THE MAIN COLLECTION
    // We modify the 'posts' and 'pages' locals that generators use.
    // Instead of just filtering, we provide a clean Query object.
    const publicPosts = posts.find({password: {$exists: false}});
    const publicPages = pages.find({password: {$exists: false}});

    this.locals.set('posts', () => publicPosts);
    this.locals.set('pages', () => publicPages);
    
    // Also update 'site.posts' which some themes/plugins use directly
    const siteLocals = this.locals.asObject ? this.locals.asObject() : (this.locals.toObject ? this.locals.toObject() : this.locals);
    if (siteLocals.site) {
        siteLocals.site.posts = publicPosts;
        siteLocals.site.pages = publicPages;
    }
});

// Step 2: Ensure individual pages for locked items are still generated
// Since we removed them from the main 'posts' collection, they won't 404.
hexo.extend.generator.register('locked_content_generator', function(locals) {
    const lockedList = locals.locked_items || [];
    return lockedList.map(item => {
        return {
            path: item.path,
            layout: item.layout || (item.source.includes('_posts') ? 'post' : 'page'),
            data: item
        };
    });
});
