#include <iostream>
#include <cmath>

using namespace std;

// #define rent_inflation_rate 5.2; (I wanted to use define but it's not working)
const double rent_inflation_rate = 5.0;


// This function calculates the projected rent increase for the following rental period based on the current amounts
double new_rent(double current_rent, double rent_inflation_rate){
    double rent_increase = rent_inflation_rate*0.01*current_rent  ;
    return rent_increase + current_rent;
}

// This function calculates the total rent over a period of time, based on the number of times rent is collected per year, the amount that is collected, the total number of years, and the rate at which the rent inflates
double total_rent(double base_rent, int time_period, int charges_per_year, double rent_inflation_rate){
    int billing_blocks = time_period * charges_per_year;
    int year(0), ctr(0);
    double total_rent(0), current_rent(base_rent);


    for (int i = 1; i <= billing_blocks; i++){
        total_rent += current_rent;
        if(++ctr ==charges_per_year){
            ctr =0;
            current_rent = new_rent(current_rent, rent_inflation_rate);
        }
    };
    return total_rent;
}

//This is a function that alerts the user if the total rent amount projected for the time period the user plans to stay exceeds their budget
bool rent_flag(double curent_rent, double inflation_rate, int time_period, double charges_per_year, double budget){
    if (total_rent(curent_rent, time_period, charges_per_year, inflation_rate) > budget){
        return 1;
    }
    return 0;
}

int valid_years(double current_rent, double inflation_rate, double charges_per_year, double budget){
    int valid_years(0);
    double total;
    do{
        valid_years++;
        total = total_rent(current_rent, valid_years, charges_per_year, inflation_rate);


        cout << valid_years << " | " << total << " | " << endl;

    } while (total <= budget);
    return valid_years - 1;
}


void get_valid_number_inputs(double lower_bound, double upper_bound, double& destination){
    do{
        cout << "Input value: "<< endl;
        cin >> destination;
    } while(!((destination >=lower_bound) && (destination <= upper_bound)));
}



int main(){
    // double init_rent = 1;

    // cout << "New rent is: "<< new_rent(init_rent, rent_inflation_rate) << endl;

    // cout << "The total rent over the next 1 years with 1 charge cycles is " << total_rent(init_rent, 1, 1, rent_inflation_rate)<< endl;
    // cout << "The total rent over the next 1 years with 2 charge cycles is " << total_rent(init_rent, 1, 2, rent_inflation_rate)<< endl;
    // cout << "The total rent over the next 2 years with 1 charge cycles is " << total_rent(init_rent, 2, 1, rent_inflation_rate)<< endl;
    // cout << "The total rent over the next 2 years with 2 charge cycles is " << total_rent(init_rent, 2, 2, rent_inflation_rate)<< endl;

    // int year = valid_years(init_rent, rent_inflation_rate, 1, 5);

    // cout << "Valid years: " << year;

    double rent(0);

    get_valid_number_inputs(0, 10, rent);

    cout << rent;
    
    return 0;
}