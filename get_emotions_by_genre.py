# -- a mariana é puta mas nao lhe digas -- #
# -- princesa única talentosa amorosa -- #
import pandas as pd

song_emotion_df = pd.read_csv("datasets/tcc_ceds_music_clean.csv", delimiter=',', encoding=None)
genres_df = pd.read_csv("datasets/artist_genre.csv", delimiter=',', encoding=None)

#-- remove irrelevant columns --#

song_emotion_df.drop(['genre','len','age'], axis=1, inplace=True)

#-- join tables --#

genres_df = song_emotion_df.merge(genres_df, left_on='artist_name', right_on='artist_name')

#-- remove irrelevant columns --#

genres_df.drop(['Unnamed: 0','artist_name','track_name','release_date','topic', 'lyrics'], axis=1, inplace=True)


genres_df['# numero de vezes que aparece'] = genres_df['genre'].map(genres_df['genre'].value_counts())

emotions = ['dating', 'violence', 'world/life', 'night/time', 'shake the audience',
    'family/gospel', 'romantic', 'communication', 'obscene', 'music', 'movement/places',
    'light/visual perceptions', 'family/spiritual', 'like/girls', 'sadness', 'feelings',
    'danceability', 'loudness', 'acousticness', 'instrumentalness', 'valence', 'energy']
    
for emotion in emotions:
    genres_df['sum'] = genres_df.groupby(['genre'])[emotion].transform('sum')
    genres_df['avg_' + emotion] = genres_df['sum'] / genres_df['# numero de vezes que aparece']

genres_df.drop(['sum', '# numero de vezes que aparece'] + emotions, axis=1, inplace=True)
genres_df.drop_duplicates(subset="genre", keep='first', inplace=True)

genres_df.to_csv('emotions_by_genre.csv', index=False, header=True)

# """ vinhooooos """
# # find the amout of wines per country

# output_df['# wines/country'] = output_df['country'].map(output_df['country'].value_counts())

# output_df['sum'] = output_df.groupby(['country'])['price'].transform('sum')

# output_df['avg price per country'] = output_df['sum'] / output_df['# wines/country']

# # delete irrelevant columns

# output_df.drop(['# wines/country', 'sum', 'price', 'country'], axis=1, inplace=True)

# output_df.drop_duplicates(subset="alpha-2", keep='first', inplace=True)

# # sort by price

# output_df.sort_values('avg price per country', inplace=True)

# output_df.to_csv('G37-93737.csv', index=False, header=True)