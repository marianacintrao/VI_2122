import pandas as pd

artist_emotion_df = pd.read_csv("datasets/tcc_ceds_music_clean.csv", delimiter=',', encoding=None)

#-- remove irrelevant columns --#

artist_emotion_df.drop(['len','age'], axis=1, inplace=True)

#-- remove irrelevant columns --#

artist_emotion_df.drop(['Unnamed: 0','track_name','release_date','topic', 'lyrics','genre'], axis=1, inplace=True)

artist_emotion_df['occurrences'] = artist_emotion_df['artist_name'].map(artist_emotion_df['artist_name'].value_counts())

themes = ['dating', 'violence', 'world/life', 'night/time', 'shake the audience',
    'family/gospel', 'romantic', 'communication', 'obscene', 'music', 'movement/places',
    'light/visual perceptions', 'family/spiritual', 'like/girls', 'sadness', 'feelings',
    'danceability', 'loudness', 'acousticness', 'instrumentalness', 'valence', 'energy']
    
#-- get average values --#

for emotion in themes:
    artist_emotion_df['sum'] = artist_emotion_df.groupby(['artist_name'])[emotion].transform('sum')
    artist_emotion_df['avg_' + emotion] = artist_emotion_df['sum'] / artist_emotion_df['occurrences']

artist_emotion_df.drop(['sum'] + themes, axis=1, inplace=True)
artist_emotion_df.drop_duplicates(subset="artist_name", keep='first', inplace=True)
artist_emotion_df.sort_values("occurrences", ascending=False, inplace=True)

artist_emotion_df.to_csv('themes_by_artist.csv', index=False, header=True)
