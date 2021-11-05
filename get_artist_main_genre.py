import pandas as pd
from collections import Counter

artist_genre_df = pd.read_csv("datasets/artist_genre.csv", delimiter=',', encoding=None)

genres_df = pd.read_csv("datasets/themes_by_specific_genre.csv", delimiter=',', encoding=None)

#-- remove irrelevant columns --#

genres_df.drop(['occurrences','dating','violence','world/life','night/time','shake the audience','family/gospel','romantic','communication','obscene','music','movement/places','light/visual perceptions','family/spiritual','like/girls','sadness','feelings','danceability','loudness','acousticness','instrumentalness','valence','energy','theme_weight'], axis=1, inplace=True)

#-- get average values --#
artist = ""
genres = []

new_df = pd.DataFrame()


for index, row in artist_genre_df.iterrows():
    artist_name = row["artist_name"]
    if artist != artist_name and artist != "":

        if genres != []:

            print(genres)
            main_genre = max(set(genres), key=genres.count)

            new_row = row
            new_row["artist_name"] = artist
            new_row["specific_genre"] = main_genre

            new_df = new_df.append(new_row, ignore_index = True)

        artist = ""
        genres = []

    artist = artist_name
    specific_genre = row["specific_genre"]
    genre_row = genres_df.loc[genres_df['specific_genre'] == specific_genre]
    try:
        main_genre = genre_row["main_genre"].item()
        genres.append(main_genre)
    except:
        print("shit")

new_df.to_csv('artist_main_genre.csv', index=False, header=True)
    
