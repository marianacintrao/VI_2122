import pandas as pd

song_theme_df = pd.read_csv("datasets/tcc_ceds_music_clean.csv", delimiter=',', encoding=None)
genres_df = pd.read_csv("datasets/artist_genre.csv", delimiter=',', encoding=None)

#-- remove irrelevant columns --#

song_theme_df.drop(['len','age'], axis=1, inplace=True)

song_theme_df.rename(columns={'genre': 'main_genre'}, inplace=True)

#-- join tables --#

genres_df = song_theme_df.merge(genres_df, left_on='artist_name', right_on='artist_name')

#-- remove irrelevant columns --#

genres_df.drop(['Unnamed: 0','artist_name','track_name','release_date','topic', 'lyrics'], axis=1, inplace=True)

genres_df.rename(columns={'genre': 'specific_genre'}, inplace=True)

#-- get correct super genre --#

for index, row in genres_df.iterrows():
    specific = row['specific_genre']

    #-- rock --#
    if "rock" in specific or "alt" in specific or "alternative" in specific or "indie" in specific:
        genres_df.at[index, "main_genre"] = "rock"

    #-- pop --#
    if "pop" in specific or "lo-fi" in specific or "wave" in specific or "dance" in specific or "disco" in specific:
        genres_df.at[index, "main_genre"] = "pop"

    #-- punk --#
    if "punk" in specific:
        genres_df.at[index, "main_genre"] = "punk"

     #-- metal --#
    if "metal" in specific or "djent" in specific:
        genres_df.at[index, "main_genre"] = "metal"

    #-- folk --#
    if "folk" in specific:
        genres_df.at[index, "main_genre"] = "folk"

    #-- country --#
    if "country" in specific:
        genres_df.at[index, "main_genre"] = "country"

    #-- reggae --#
    if "reggae" in specific:
        genres_df.at[index, "main_genre"] = "reggae"

    #-- hip hop --#
    if "rap" in specific or "hop" in specific or "trap" in specific:
        genres_df.at[index, "main_genre"] = "hip hop"

    #-- eletronic --#
    if "electro" in specific or "techno" in specific or "edm" in specific:
        genres_df.at[index, "main_genre"] = "eletronica"

    #-- r&b --#
    if "soul" in specific or "funk" in specific or "doo-wop" in specific or "blues" in specific:
        genres_df.at[index, "main_genre"] = "r&b"

    #-- jazz --#
    if "jazz" in specific or "adult" in specific or "ambient" in specific:
        genres_df.at[index, "main_genre"] = "jazz"

    #-- religious --#
    if "christian" in specific or "crist" in specific:
        genres_df.at[index, "main_genre"] = "religious"


genres_df['occurrences'] = genres_df['main_genre'].map(genres_df['main_genre'].value_counts())

themes = ['dating', 'violence', 'world/life', 'night/time', 'shake the audience',
    'family/gospel', 'romantic', 'communication', 'obscene', 'music', 'movement/places',
    'light/visual perceptions', 'family/spiritual', 'like/girls', 'sadness', 'feelings',
    'danceability', 'loudness', 'acousticness', 'instrumentalness', 'valence', 'energy']
    
#-- get average values --#

for theme in themes:
    genres_df['sum'] = genres_df.groupby(['main_genre'])[theme].transform('sum')
    genres_df['avg_' + theme] = genres_df['sum'] / genres_df['occurrences']

genres_df.drop(['sum','specific_genre'] + themes, axis=1, inplace=True)
genres_df.drop_duplicates(subset="main_genre", keep='first', inplace=True)
genres_df.sort_values("occurrences", ascending=False, inplace=True)


genres_df.to_csv('themes_by_main_genre.csv', index=False, header=True)
