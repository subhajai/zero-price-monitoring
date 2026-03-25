const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const { algoliasearch } = require('algoliasearch');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8888;

// Cache setup to save Algolia costs
let productsCache = {
    data: [],
    totalHits: 0,
    timestamp: 0
};
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes cache

async function fetchAllZeroPriceProducts() {
    const appId = process.env.ALGOLIA_APP_ID;
    const apiKey = process.env.ALGOLIA_API_KEY;
    const indexName = process.env.ALGOLIA_INDEX_NAME;
    
    if (!appId || !apiKey || !indexName) {
        throw new Error('Algolia credentials missing');
    }

    const client = algoliasearch(appId, apiKey);
    let allHits = [];

    await client.browseObjects({
        indexName,
        aggregator: (res) => {
            if (res.hits) {
                allHits.push(...res.hits);
            }
        },
        browseParams: {
            filters: 'price=0 OR final_price=0',
            hitsPerPage: 1000
        }
    });

    return allHits;
}

// Serve the static frontend
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Local API endpoint that serves from cache
app.get('/api/products', async (req, res) => {
    try {
        const forceRefresh = req.query.refresh === 'true';
        const now = Date.now();
        
        // Refresh cache if expired or forced
        if (forceRefresh || now - productsCache.timestamp > CACHE_TTL) {
            console.log('Fetching fresh data from Algolia Browse API...');
            const hits = await fetchAllZeroPriceProducts();
            productsCache = {
                data: hits,
                totalHits: hits.length,
                timestamp: now
            };
            console.log(`Cached ${hits.length} products.`);
        }

        const page = parseInt(req.query.page) || 0;
        const hitsPerPage = parseInt(req.query.hitsPerPage) || 50;
        
        // Manual pagination from cache
        const start = page * hitsPerPage;
        const end = start + hitsPerPage;
        const paginatedHits = productsCache.data.slice(start, end);

        res.json({
            hits: paginatedHits,
            nbHits: productsCache.totalHits,
            page: page,
            nbPages: Math.ceil(productsCache.totalHits / hitsPerPage)
        });
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

app.listen(PORT, () => {
    console.log(`Zero Price Monitor running at http://localhost:${PORT}`);
    // Pre-warm the cache
    fetchAllZeroPriceProducts().then(hits => {
        productsCache = { data: hits, totalHits: hits.length, timestamp: Date.now() };
        console.log(`Pre-warmed cache with ${hits.length} products.`);
    }).catch(console.error);
});
