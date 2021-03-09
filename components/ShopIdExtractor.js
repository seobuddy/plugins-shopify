class ShopIdExtractor {
    static extract(fullId) {
        return fullId.replace('gid://shopify/Shop/', '');
    }
}

export default ShopIdExtractor;