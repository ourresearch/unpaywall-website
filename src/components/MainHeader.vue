<template>
    <div class="container">
        <img src="../assets/logo.png" alt="">


    </div>


</template>

<script>

    import SearchBox from "./SearchBox";
    export default {
        components: {SearchBox},
        name: 'MainHeader'
    }
</script>

<style scoped lang="scss">
    body.home {
        .container {
            background: none;
        }
    }
    .container {
        background: #333;
        height: 88px;
        display: flex;
        align-items: center;
        padding: 0 30px;
        img {
            height: 35px;

        }
    }



</style>