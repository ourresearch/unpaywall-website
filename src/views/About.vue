<template>
    <div class="page about">
        <h1>About</h1>
        <ul>
            <li><router-link to="/team">Team</router-link></li>
            <li><router-link to="/faq">FAQ</router-link></li>
            <li><router-link to="/data-format">Data format guide</router-link></li>
            <li><router-link to="/sources">Data sources</router-link></li>
            <li><router-link to="/contact">Contact</router-link></li>
        </ul>
    </div>
</template>

<script>
    export default {
        name: "About",
        metaInfo: {
            title: "About"
        }
    }
</script>

<style scoped>

</style>