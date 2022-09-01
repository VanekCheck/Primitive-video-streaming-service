var Genres;
(function (Genres) {
    Genres["Drama"] = "Drama";
    Genres["Comedy"] = "Comedy";
    Genres["Adventure"] = "Adventure";
    Genres["Documentary"] = "Documentary";
    Genres["Children"] = "Children";
    Genres["Reality"] = "Reality";
    Genres["Horror"] = "Horror";
    Genres["Animation"] = "Animation";
})(Genres || (Genres = {}));
class User {
    constructor() {
        this.subscriptions = [];
    }
    subscribe(streamingService) {
        // if user is already subscribed
        if (this.subscriptions.some((currentSubs) => currentSubs.streamingService === streamingService)) {
            throw new Error('The user is already subscribed to this streaming service');
        }
        // create new Subscription
        const subscription = new Subscription(streamingService);
        // push to subscriptions array
        this.subscriptions.push(subscription);
        return subscription;
    }
}
class Subscription {
    constructor(streamingService) {
        this.streamingService = streamingService;
    }
    watch(show) {
        // getCurrentShow
        const currentShowViews = this.streamingService.viewsByShowNames.get(show);
        // Map.get() returns undefined if no such show
        if (currentShowViews === undefined) {
            throw new Error('There is no such show.');
        }
        // add 1 view to the current show
        this.streamingService.viewsByShowNames.set(show, currentShowViews + 1);
    }
    getRecommendationTrending() {
        const currentYear = new Date().getFullYear();
        // filter shows by year
        const showsFilteredByYear = this.streamingService.getMostViewedShowsOfYear(currentYear);
        // return random Show
        return this.getRecommendation(showsFilteredByYear);
    }
    getRecommendationByGenre(genre) {
        // filter shows by genre
        const showsFilteredByGenre = this.streamingService.getMostViewedShowsOfGenre(genre);
        // return random Show
        return this.getRecommendation(showsFilteredByGenre);
    }
    getRecommendation(filteredMostViewedShows) {
        // sort before get a random one ??????
        filteredMostViewedShows.sort((a, b) => b.getDuration() - a.getDuration());
        // get random
        return filteredMostViewedShows[Math.floor(Math.random() * filteredMostViewedShows.length)];
    }
}
class StreamingService {
    constructor(name, shows) {
        this.name = name;
        this.shows = shows;
        // set started views to every show
        this.viewsByShowNames = new Map([...shows].map((show) => [show.name, 0]));
    }
    addShow(show) {
        // if there are duplicates
        if (this.shows.some((currentShow) => currentShow === show)) {
            throw new Error('The show has already on the streaming service');
        }
        // push show to list
        this.shows.push(show);
        // set started views
        this.viewsByShowNames.set(show.name, 0);
    }
    getMostViewedShowsOfYear(year) {
        // validate year input
        if (!(Number.isInteger(year) &&
            year > 1940 &&
            year <= new Date().getFullYear())) {
            throw new RangeError('Invalid year');
        }
        // filter shows by year
        const showsOfTheCurrentYear = this.shows.filter((currentShow) => currentShow.releaseDate.getFullYear() === year);
        // return 10 most viewed shows
        return this.getMostViewed(showsOfTheCurrentYear);
    }
    getMostViewedShowsOfGenre(genre) {
        // filter shows by year
        const showsOfTheCurrentGenre = this.shows.filter((currentShow) => currentShow.genre === genre);
        // return 10 most viewed shows
        return this.getMostViewed(showsOfTheCurrentGenre);
    }
    getMostViewed(filteredShows) {
        if (filteredShows.length === 0) {
            throw new Error('There is no shows by current filter');
        }
        // create array [[showName, views ]] to sort by views
        const showsWithViews = filteredShows.map((show) => [
            show,
            this.viewsByShowNames.get(show.name),
        ]);
        // sort by views
        showsWithViews.sort((a, b) => b[1] - a[1]);
        // go back to show array
        const mostViewed = showsWithViews.map(([value]) => value);
        // return 10 most viewed
        return mostViewed.length <= 10 ? mostViewed : mostViewed.slice(0, 10);
    }
}
class Show {
    constructor(name, genre, releaseDate) {
        this.name = name;
        this.genre = genre;
        this.releaseDate = releaseDate;
    }
}
class Movie extends Show {
    constructor(name, genre, releaseDate) {
        super(name, genre, releaseDate);
    }
    getDuration() {
        return Date.now() - this.releaseDate.getMilliseconds();
    }
}
class Episode extends Show {
    constructor(name, genre, releaseDate) {
        super(name, genre, releaseDate);
    }
    getDuration() {
        return Date.now() - this.releaseDate.getMilliseconds();
    }
}
class Series extends Show {
    constructor(name, genre, releaseDate, episodes) {
        super(name, genre, releaseDate);
        this.episodes = episodes;
    }
    getDuration() {
        return Date.now() - this.releaseDate.getMilliseconds();
    }
}
// === Population ===
// create shows
const Movie1 = new Movie('Avengers: Endgame', Genres.Animation, new Date(2001, 2, 20));
const Movie2 = new Movie('Top Gun: Maverick', Genres.Documentary, new Date(2018, 4, 20));
const Episode1 = new Episode('Whiplash Saxifrage', Genres.Drama, new Date(2022, 2, 20));
const Episode2 = new Episode('Little Bur-clover', Genres.Drama, new Date(2020, 2, 20));
const Episode3 = new Episode("Notaris' Soot Lichen", Genres.Adventure, new Date(2020, 2, 20));
const Episode4 = new Episode('Thicket Rattlebox', Genres.Animation, new Date(2020, 2, 20));
const Series1 = new Series('Stranger things', Genres.Horror, new Date(2010, 2, 20), [Episode3, Episode4]);
const Series2 = new Series('Frozen II', Genres.Animation, new Date(2022, 2, 20), [Episode1, Episode2, Episode3]);
// create Streaming services
// Netflix, Megogo, Amazon Prime
const netflix = new StreamingService('Netflix', [Episode1, Movie1, Series1]);
const megogo = new StreamingService('Megogo', [
    Episode1,
    Episode2,
    Episode3,
    Episode4,
    Movie1,
    Movie2,
    Series1,
]);
const amazonPrime = new StreamingService('Amazon Prime', [
    Episode1,
    Episode2,
    Episode4,
    Series1,
]);
// create User
const John = new User();
// === Usage ===
// subscribe to Megogo and Netflix
const subscriptionMegogo = John.subscribe(megogo);
const subscriptionNetflix = John.subscribe(netflix);
// populate views
subscriptionMegogo.watch('Avengers: Endgame');
subscriptionMegogo.watch('Avengers: Endgame');
subscriptionMegogo.watch("Notaris' Soot Lichen");
subscriptionMegogo.watch("Notaris' Soot Lichen");
subscriptionMegogo.watch('Avengers: Endgame');
subscriptionMegogo.watch('Avengers: Endgame');
subscriptionMegogo.watch('Little Bur-clover');
subscriptionMegogo.watch('Little Bur-clover');
subscriptionMegogo.watch('Little Bur-clover');
subscriptionMegogo.watch('Top Gun: Maverick');
subscriptionMegogo.watch('Top Gun: Maverick');
subscriptionMegogo.watch('Top Gun: Maverick');
subscriptionMegogo.watch('Top Gun: Maverick');
subscriptionMegogo.watch('Top Gun: Maverick');
subscriptionMegogo.watch('Top Gun: Maverick');
subscriptionMegogo.watch('Top Gun: Maverick');
// add new Show and a few views
megogo.addShow(Series2);
subscriptionMegogo.watch('Frozen II');
subscriptionMegogo.watch('Frozen II');
subscriptionMegogo.watch('Frozen II');
console.info('\n\nCurrent Views');
console.table(Object.fromEntries(megogo.viewsByShowNames));
console.info('\n\nAll shows of the `Animation` genre');
console.table(megogo.getMostViewedShowsOfGenre(Genres.Animation));
console.info('\n\nAll shows of 2020');
console.table(megogo.getMostViewedShowsOfYear(2020));
console.info('\n\nRecommended Show of the `Animation` genre');
console.table(subscriptionMegogo.getRecommendationByGenre(Genres.Animation));
console.info('\n\nRecommended Show of the current year');
console.table(subscriptionMegogo.getRecommendationTrending());
// === Validation ===
console.info('\n\nValidation');
console.info('trying to subscribe again');
try {
    John.subscribe(netflix);
}
catch (error) {
    console.error(`ERROR: ${error.message}`);
}
console.info('trying to watch an unknown show');
try {
    subscriptionMegogo.watch('Something');
}
catch (error) {
    console.error(`ERROR: ${error.message}`);
}
console.info('trying to add the same show');
try {
    megogo.addShow(Series2);
}
catch (error) {
    console.error(`ERROR: ${error.message}`);
}
console.info('trying to enter an invalid year');
try {
    megogo.getMostViewedShowsOfYear(2045);
}
catch (error) {
    console.error(`ERROR: ${error.message}`);
}
