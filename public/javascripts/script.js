let indexApp = new Vue({
    el: '#indexApp',
    data: {
        team: "",
    },
    mounted() {
        if (localStorage.team) {
            this.team = localStorage.team;
        }
    },
    watch: {
        team(newTeam) {
            localStorage.team = newTeam;
        }
    }
});
