<template>
    <svg class="icon" aria-hidden="true">
        <use :xlink:href="getIcon"></use>
    </svg>
</template>

<script>
    export default {
        name: "SvgIcon",
        props:{
            iconName:{
                type:String,
                required:true
            }
        },
        computed:{
            getIcon(){
                return `#icon-${this.iconName}`;
            }
        }
    }
</script>

<style scoped lang="scss">
    .icon {
        width: 1em;
        height: 1em;
        vertical-align: -0.15em;
        fill: currentColor;
        overflow: hidden;
    }
</style>