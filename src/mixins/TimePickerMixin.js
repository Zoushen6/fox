export default {
    data() {
        return {
            shortcutsSettings:['today','yesterday','lastSeven', 'lastThirty','curWeek','lastWeek','curMonth','lastMonth'],
            shortcutsSetting:['today','yesterday','lastSeven', 'lastThirty', 'lastNinety','curWeek','lastWeek','curMonth','lastMonth'],
            statisticsTime: [
                new Date().getTime() - 3600 * 1000 * 24 * 7,
                new Date().getTime(),
            ]
        }
    }
}
