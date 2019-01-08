const settings = require('../../settings');
const moment = require('moment');
const twitchAPI = require('../../utils/twitch-api');

const createdAtCache = {};

class NewUserStyleModule {
    constructor() {
        settings.add({
            id: 'newUserAlert',
            name: 'Highlight New Users',
            defaultValue: false,
            description: 'Identify messages from new users (<24 hours) with an orange left bar'
        });
    }

    render($el, msg) {
        if (settings.get('newUserAlert') === false) return;

        const userID = msg.user.userID;
        if (!userID) return;

        const now = moment(new Date());
        let createdTS;

        if (createdAtCache[userID]) {
            createdTS = moment(createdAtCache[userID]);
            const since = now.diff(createdTS, 'hours');
            if (since < 24) {
                $el.toggleClass('bttv-new-user-alert-left-bar');
            }
        } else {
            twitchAPI.get(`users/${userID}`)
                .then(({created_at: createdAt}) => {
                    createdTS = moment(createdAt);
                    createdAtCache[userID] = createdAt;
                    const since = now.diff(createdTS, 'hours');
                    if (since < 24) {
                        $el.toggleClass('bttv-new-user-alert-left-bar');
                    }
                })
                .catch();
        }
    }
}

module.exports = new NewUserStyleModule();
