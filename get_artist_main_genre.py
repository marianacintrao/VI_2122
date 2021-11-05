import pandas as pd
from collections import Counter

artist_genre_df = pd.read_csv("datasets/artist_genre.csv", delimiter=',', encoding=None)

genres_df = pd.read_csv("datasets/specific_genre_by_main_genre.csv", delimiter=',', encoding=None)

final_df = pd.read_csv("datasets/themes_by_artist.csv", delimiter=',', encoding=None)

#-- remove irrelevant columns --#

# genres_df.drop(['occurrences','dating','violence','world/life','night/time','shake the audience','family/gospel','romantic','communication','obscene','music','movement/places','light/visual perceptions','family/spiritual','like/girls','sadness','feelings','danceability','loudness','acousticness','instrumentalness','valence','energy','theme_weight'], axis=1, inplace=True)

#-- get average values --#
artist = ""
genres = []

new_df = pd.DataFrame()


for index, row in artist_genre_df.iterrows():
    artist_name = row["artist_name"]
    if artist != artist_name and artist != "":
        main_genre = ""
        if genres != []:
            main_genre = max(set(genres), key=genres.count)

        for index2, row2 in final_df.iterrows():
            if row2["artist_name"] == artist_name:
                final_df.at[index2, "main_genre"] = main_genre
                print(artist_name)
        # new_row = row
        # new_row["artist_name"] = artist
        # if genres != []:

        #     main_genre = max(set(genres), key=genres.count)
        #     new_row["specific_genre"] = main_genre

        # else:
        #     new_row["specific_genre"] = ""

        # new_df = new_df.append(new_row, ignore_index = True)
        artist = ""
        genres = []

    artist = artist_name
    specific_genre = row["specific_genre"]
    genre_row = genres_df.loc[genres_df['specific gen'] == specific_genre]
    try:
        main_genre = genre_row["main genre"].item()
        genres.append(main_genre)
    except:
        print("shit")

final_df.to_csv('themes_by_artist.csv', index=False, header=True)
 
    
