<template>
    <div class="page products">
        <h1>Products</h1>
        <ul>
            <li><router-link to="/products/snapshot">Database snapshot</router-link></li>
                <li><router-link to="/products/data-feed">Data Feed</router-link></li>
                <li><router-link to="/products/api">REST API</router-link></li>
                <li><router-link to="/products/simple-query-tool">Simple Query Tool</router-link></li>
                <li><router-link to="/products/extension">Chrome/Firefox extension</router-link></li>
                <li><router-link to="/integrations#link-resolvers">Library link resolver integration</router-link></li>

        </ul>
    </div>
</template>

<script>
    export default {
        name: "Products",
        metaInfo: {
            title: "Products"
        }
    }
</script>

<style scoped>

</style>