<template>
    <div class="search-box">
        <input v-model="query" @keyup.enter="goSearch"></input>
        <div class="icon md-primary" @click="goSearch">
            <md-icon>search</md-icon>

        </div>


    </div>
</template>

<script>
    export default {
        name: "SearchBox",
        data: () => ({
            query:""
        }),
        computed: {
            cleanQuery(){
                return _.snakeCase(this.query)
            }
        },
        methods: {
            goSearch(){

                this.$router.push({
                    name: "search",
                    params: {
                        q: this.cleanQuery
                    }
                })

            }
        }
    }
</script>

<style scoped>
    div.search-box {
        width: 100%;
        max-width: 500px;
        padding: 20px 0;
        border: none !important;
        display: flex;
    }
    
    div.search-box input {
        height: inherit;
        outline: none; /* clear browser styles */
        width: 500px;
        font-size: 18px;
        padding: 10px 20px;
        border: 1px solid #aaa;
        border-radius: 2px;
        box-shadow: 0px 2px 2px rgba(0,0,0,.2);
        transition: box-shadow 0.3s;
    }
    
    div.search-box input:hover {
        box-shadow: 0px 2px 6px rgba(0,0,0,.4);
    }
    
    div.search-box div.icon {
        display: flex;
        margin-left: -40px;
        cursor: pointer;
        color: #2196F3;
    }
</style>