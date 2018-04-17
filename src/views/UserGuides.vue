<template>
    <div class="page user-guide">
        <h1>{{ guideName }} user guide</h1>



        <div class="table-of-contents" v-if="!guideName">
            ToC stuff
        </div>

        <div class="enterprise" v-if="guideName=='enterprise'">
            enterprise stuff
        </div>

        <div class="research" v-if="guideName=='research'">
            research stuff
        </div>

        <div class="libraries" v-if="guideName=='libraries'">
            libraries stuff
        </div>



    </div>
</template>

<script>
    export default {
        name: "UserGuides",
        data(){
            return {
                guideName: ""
            }
        },
        metaInfo(){
            let ret = {
                title: "User guides"
            }
            if (this.guideName){
                ret.title = _.capitalize(this.guideName + " user guide")
            }
            return ret
        },
        mounted(){
             this.guideName = this.$route.params.guideName
        },
        watch: {
            '$route' (to, from){
                this.guideName = to.params.guideName
            }
        }
    }
</script>

<style scoped>

    h1 {
        text-transform: capitalize;
    }

</style>