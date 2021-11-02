from io import StringIO
import json
import pandas as pd
import sys
from marshmallow import Schema, fields
from pprint import pprint


class Artist:
    def __init__(self, name, theme_weght, dating, violence, life, time, audience, family, romantic, \
        communication, obscene, music, places, visual, spiritual, girls, sadness, feelings):
        self.name = name
        self.theme_weght = theme_weght
        self.dating = dating
        self.violence = violence
        self.life = life
        self.time = time
        self.audience = audience
        self.family = family
        self.romantic = romantic
        self.communication = communication
        self.obscene = obscene
        self.music = music
        self.places = places
        self.visual = visual
        self.spiritual = spiritual
        self.girls = girls
        self.sadness = sadness
        self.feelings = feelings
        self.children = []
class ArtistSchema(Schema):
    name = fields.Str()
    theme_weght = fields.Decimal()
    dating = fields.Decimal()
    violence = fields.Decimal()
    life = fields.Decimal()
    time = fields.Decimal()
    audience = fields.Decimal()
    family = fields.Decimal()
    romantic = fields.Decimal()
    communication = fields.Decimal()
    obscene = fields.Decimal()
    music = fields.Decimal()
    places = fields.Decimal()
    visual = fields.Decimal()
    spiritual = fields.Decimal()
    girls = fields.Decimal()
    sadness = fields.Decimal()
    feelings = fields.Decimal()

class SpecificGenre:
    def __init__(self, name, theme_weght, dating, violence, life, time, audience, family, romantic, \
        communication, obscene, music, places, visual, spiritual, girls, sadness, feelings):
        self.name = name
        self.theme_weght = theme_weght
        self.dating = dating
        self.violence = violence
        self.life = life
        self.time = time
        self.audience = audience
        self.family = family
        self.romantic = romantic
        self.communication = communication
        self.obscene = obscene
        self.music = music
        self.places = places
        self.visual = visual
        self.spiritual = spiritual
        self.girls = girls
        self.sadness = sadness
        self.feelings = feelings
        self.children = []
class SpecificGenreSchema(Schema):
    name = fields.Str()
    theme_weght = fields.Decimal()
    dating = fields.Decimal()
    violence = fields.Decimal()
    life = fields.Decimal()
    time = fields.Decimal()
    audience = fields.Decimal()
    family = fields.Decimal()
    romantic = fields.Decimal()
    communication = fields.Decimal()
    obscene = fields.Decimal()
    music = fields.Decimal()
    places = fields.Decimal()
    visual = fields.Decimal()
    spiritual = fields.Decimal()
    girls = fields.Decimal()
    sadness = fields.Decimal()
    feelings = fields.Decimal()
    children = fields.List(fields.Nested(ArtistSchema()))

class MainGenre:
    def __init__(self, name, theme_weght, dating, violence, life, time, audience, family, romantic, \
        communication, obscene, music, places, visual, spiritual, girls, sadness, feelings):
        self.name = name
        self.theme_weght = theme_weght
        self.dating = dating
        self.violence = violence
        self.life = life
        self.time = time
        self.audience = audience
        self.family = family
        self.romantic = romantic
        self.communication = communication
        self.obscene = obscene
        self.music = music
        self.places = places
        self.visual = visual
        self.spiritual = spiritual
        self.girls = girls
        self.sadness = sadness
        self.feelings = feelings
        self.children = []
class MainGenreSchema(Schema):
    name = fields.Str()
    theme_weght = fields.Decimal()
    dating = fields.Decimal()
    violence = fields.Decimal()
    life = fields.Decimal()
    time = fields.Decimal()
    audience = fields.Decimal()
    family = fields.Decimal()
    romantic = fields.Decimal()
    communication = fields.Decimal()
    obscene = fields.Decimal()
    music = fields.Decimal()
    places = fields.Decimal()
    visual = fields.Decimal()
    spiritual = fields.Decimal()
    girls = fields.Decimal()
    sadness = fields.Decimal()
    feelings = fields.Decimal()
    children = fields.List(fields.Nested(SpecificGenreSchema()))

class Root:
    def __init__(self):
        self.name = "avg"
        self.theme_weght = -1
        self.dating = 0.021135151
        self.violence = 0.118394533
        self.life = 0.121096324
        self.time = 0.057428954
        self.audience = 0.017416271
        self.family = 0.017060131
        self.romantic = 0.048758609
        self.communication = 0.076700245
        self.obscene = 0.09670947
        self.music = 0.060099526
        self.places = 0.047387168
        self.visual = 0.049032521
        self.spiritual = 0.024162994
        self.girls = 0.028054161
        self.sadness = 0.129534733
        self.feelings = 0.031003342
        self.children = []
class RootSchema(Schema):
    name = fields.Str()
    theme_weght = fields.Decimal()
    dating = fields.Decimal()
    violence = fields.Decimal()
    life = fields.Decimal()
    time = fields.Decimal()
    audience = fields.Decimal()
    family = fields.Decimal()
    romantic = fields.Decimal()
    communication = fields.Decimal()
    obscene = fields.Decimal()
    music = fields.Decimal()
    places = fields.Decimal()
    visual = fields.Decimal()
    spiritual = fields.Decimal()
    girls = fields.Decimal()
    sadness = fields.Decimal()
    feelings = fields.Decimal()
    children = fields.List(fields.Nested(MainGenreSchema()))

# # # # # # # # # # # # # # # # # # # # # # # # # #

main_genre_df = pd.read_csv("datasets/themes_by_main_genre.csv", delimiter=',', encoding=None)
specific_genre_df = pd.read_csv("datasets/themes_by_specific_genre.csv", delimiter=',', encoding=None)
artist_df = pd.read_csv("datasets/themes_by_artist.csv", delimiter=',', encoding=None)
artist_genre_df = pd.read_csv("datasets/artist_genre.csv", delimiter=',', encoding=None)


root = Root()

for index1, main_row in main_genre_df.iterrows():
    name1 = main_row['main_genre']
    main_genre = MainGenre(name1, main_row["theme_weight"], main_row["dating"], main_row["violence"], main_row["world/life"], \
        main_row["night/time"], main_row["shake the audience"], main_row["family/gospel"], main_row["romantic"], \
        main_row["communication"], main_row["obscene"], main_row["music"], main_row["movement/places"], main_row["light/visual perceptions"], \
        main_row["family/spiritual"], main_row["like/girls"], main_row["sadness"], main_row["feelings"])

    print(name1)
    for index2, specific_row in specific_genre_df.iterrows():
        if specific_row["main_genre"] == name1:
            name2 = specific_row['specific_genre']
            specific_genre = SpecificGenre(name2, specific_row["theme_weight"], specific_row["dating"], specific_row["violence"], specific_row["world/life"], \
                specific_row["night/time"], specific_row["shake the audience"], specific_row["family/gospel"], specific_row["romantic"], \
                specific_row["communication"], specific_row["obscene"], specific_row["music"], specific_row["movement/places"], specific_row["light/visual perceptions"], \
                specific_row["family/spiritual"], specific_row["like/girls"], specific_row["sadness"], specific_row["feelings"])

            print("    " + name2)
            # for index3, artist_genre_row in artist_genre_df.iterrows():
            #     if artist_genre_row["specific_genre"] == name2:
            #         artist_name = artist_genre_row["artist_name"]

            #         print("        " + artist_name)
            #         for index3, artist_row in artist_df.iterrows():
            #             if artist_row["artist_name"] == artist_name:
            #                 # name3 = artist_row['artist_name'] 
            #                 artist = SpecificGenre(artist_name, artist_row["theme_weight"], artist_row["dating"], artist_row["violence"], artist_row["world/life"], \
            #                     artist_row["night/time"], artist_row["shake the audience"], artist_row["family/gospel"], artist_row["romantic"], \
            #                     artist_row["communication"], artist_row["obscene"], artist_row["music"], artist_row["movement/places"], artist_row["light/visual perceptions"], \
            #                     artist_row["family/spiritual"], artist_row["like/girls"], artist_row["sadness"], artist_row["feelings"])

            #                 specific_genre.children.append(artist)

            main_genre.children.append(specific_genre)

    root.children.append(main_genre)

schema = RootSchema()
result = schema.dump(root)
original_stdout = sys.stdout # Save a reference to the original standard output

with open('root.json', 'w') as f:
    sys.stdout = f # Change the standard output to the file we created.
    pprint(result, indent=2)
    sys.stdout = original_stdout


# jsonStr = json.dumps(root, default=lambda o: o.__dict__, indent=4)
# with open('root1.json', 'w') as f:
#     sys.stdout = f # Change the standard output to the file we created.
#     print(jsonStr)
#     sys.stdout = original_stdout