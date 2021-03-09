const getShopInfo = async (accessToken, shop, returnUrl = process.env.HOST) => {
    const query = JSON.stringify({
        query: `{
            shop {
                id
                name
                email
                primaryDomain {
                  host
                  url
                }
                url
                myshopifyDomain
            }
        }`
    });

    const response = await fetch(`https://${shop}/admin/api/2020-10/graphql.json`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            "X-Shopify-Access-Token": accessToken,
        },
        body: query
    })

    const responseJson = await response.json();
    return responseJson;
};

module.exports = getShopInfo;