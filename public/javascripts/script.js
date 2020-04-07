let indexApp = new Vue({
    el: '#indexApp',
    data: {
        team: "",
    },
    mounted() {
        if (localStorage.team) {
            this.team = localStorage.team;
        }
        // The scrolling should not be here
    },
    watch: {
        team(newTeam) {
            localStorage.team = newTeam;
        }
    },
    computed: {
        teamColor() {
            if (this.team == 'blue') 
                return 'bg-blue-800'
            else if (this.team == 'red')
                return 'bg-red-800'
            else    
                return 'bg-gray-900'
        }
    }
});
