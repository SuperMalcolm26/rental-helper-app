#include <iostream>
#include <fstream>
#include "header_files/json.hpp"
using namespace std;

class Review{
    private:
        int stars;
        int day;
        int month;
        int year;
        string content;
};

class Building{
    private:
        static int ctr;
        int id;
        string name;
        string address;
        int rental_cost;
        int bedrooms;
        int bathrooms;
        int size_sqft;
        bool available; // 0 for false, 1 for true
        string* amenities;
        string description;
        Review* reviews;

    public:
        Building(){
            id = ctr;
            ctr++;
            name = "unNamed";
            rental_cost = 0;
            bedrooms = 0;
            bathrooms = 0;
            size_sqft = 0;
            available = 1;
            amenities = new string[100];
            description = "";
            reviews = new Review[100];
        }
        Building(string nm, int cost, int bedroom_count, int bathroom_count, int sz, bool availab, string* amenities, string description, Review rev){
            id = ctr;
            ctr++;
            name = nm;
            rental_cost = cost;
            bedrooms = 0;
            bathrooms = 0;
            size_sqft = 0;
            available = 1;
            amenities = new string[100];
            description = "";
            reviews = new Review[100];
        }

};