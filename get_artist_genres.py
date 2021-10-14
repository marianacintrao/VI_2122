import spotipy
import pandas as pd
from spotipy.oauth2 import SpotifyClientCredentials
#-- IMPORTANT --#
''' for this script to work you have to have a credentials.py file in the same directory
    with the following variables
    cid = 'YOUR_SPOTIFY_API_CLIENT_ID'
    secret = 'YOUR_SPOTIFY_API_CLIENT_SECRET'
'''
from credentials import cid
from credentials import secret

# Spotify API autentication

client_credentials_manager = SpotifyClientCredentials(client_id=cid, client_secret=secret)
sp = spotipy.Spotify(client_credentials_manager = client_credentials_manager)

#-- create new dataframe --#

new_df = pd.DataFrame()

# artist_genre_df = pd.DataFrame()

#-- read dataset --#

song_emotion_df = pd.read_csv("datasets/tcc_ceds_music.csv", delimiter=',', encoding=None)

#-- remove irrelevant columns --#

song_emotion_df.drop(['genre','len','age'], axis=1, inplace=True)

#-- make df for keeping genres --#

artist_genre_df = song_emotion_df.copy(deep=True)

artist_genre_df.drop(['Unnamed: 0','track_name','release_date','lyrics','dating','violence','world/life','night/time','shake the audience','family/gospel','romantic','communication','obscene','music','movement/places','light/visual perceptions','family/spiritual','like/girls','sadness','feelings','danceability','loudness','acousticness','instrumentalness','valence','energy','topic'], axis=1, inplace=True)

artist_genre_df.drop_duplicates(subset='artist_name', keep='first', inplace=True)

#-- lookup corresponding genres on Spotify --#

for index, row in artist_genre_df.iterrows(): 

    artist = row['artist_name']

    artist_info = sp.search(q='artist:' + artist, type='artist')

    try:
        genres_list = artist_info['artists']['items'][0]['genres']

        for genre in genres_list:

            new_row = row
            new_row['genre'] = genre

            new_df = new_df.append(new_row, ignore_index = True)

    except:
        
        print('No artist found with name', artist)

new_df.to_csv('artist_genre.csv', index=False, header=True)

