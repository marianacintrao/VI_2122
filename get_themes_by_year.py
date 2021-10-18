import pandas as pd

emotion_by_year = pd.read_csv("datasets/tcc_ceds_music_clean.csv", delimiter=',', encoding=None)

emotion_by_year.drop(['genre','len','age'], axis=1, inplace=True)

emotion_by_year.drop(['Unnamed: 0','artist_name','track_name','topic', 'lyrics'], axis=1, inplace=True)

emotion_by_year['year_occurences'] = emotion_by_year['release_date'].map(emotion_by_year['release_date'].value_counts())

themes = ['dating', 'violence', 'world/life', 'night/time', 'shake the audience',
    'family/gospel', 'romantic', 'communication', 'obscene', 'music', 'movement/places',
    'light/visual perceptions', 'family/spiritual', 'like/girls', 'sadness', 'feelings',
    'danceability', 'loudness', 'acousticness', 'instrumentalness', 'valence', 'energy']
    
for emotion in themes:
    emotion_by_year['sum'] = emotion_by_year.groupby(['release_date'])[emotion].transform('sum')
    emotion_by_year['avg_' + emotion] = emotion_by_year['sum'] / emotion_by_year['year_occurences']

emotion_by_year.drop(['sum', 'year_occurences'] + themes, axis=1, inplace=True)
emotion_by_year.drop_duplicates(subset="release_date", keep='first', inplace=True)
emotion_by_year.sort_values('release_date', inplace=True)

emotion_by_year.to_csv('themes_by_year.csv', index=False, header=True)